terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC and Networking
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

# Single public subnet
resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, 1)
  availability_zone = var.availability_zones[0]

  tags = {
    Name = "${var.project_name}-public"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

# Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Security Group for EC2
resource "aws_security_group" "ec2" {
  name        = "${var.project_name}-ec2-sg"
  description = "Security group for EC2 instance"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Consider restricting to your IP
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Generate a new SSH key pair using terraform
resource "tls_private_key" "ssh_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Store the key pair in AWS
resource "aws_key_pair" "deployer" {
  key_name   = "${var.project_name}-deployer-key"
  public_key = tls_private_key.ssh_key.public_key_openssh
}

# Output the private key (will be used for GitHub Actions)
output "ssh_private_key" {
  value     = tls_private_key.ssh_key.private_key_pem
  sensitive = true
}

# ECR Repositories
resource "aws_ecr_repository" "frontend" {
  name                 = "citation-network-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "backend" {
  name                 = "citation-network-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# ECR Lifecycle Policies
resource "aws_ecr_lifecycle_policy" "frontend_policy" {
  repository = aws_ecr_repository.frontend.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 5 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 5
      }
      action = {
        type = "expire"
      }
    }]
  })
}

resource "aws_ecr_lifecycle_policy" "backend_policy" {
  repository = aws_ecr_repository.backend.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 5 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 5
      }
      action = {
        type = "expire"
      }
    }]
  })
}

# IAM Role for EC2
resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# IAM Policy for ECR access
resource "aws_iam_role_policy" "ecr_policy" {
  name = "${var.project_name}-ecr-policy"
  role = aws_iam_role.ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:ListImages"
        ]
        Resource = "*"
      }
    ]
  })
}

# Instance Profile
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.project_name}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

# EC2 Instance
resource "aws_instance" "app" {
  ami           = "ami-0f37c4a1ba152af46"  # Amazon Linux 2023 ARM64
  instance_type = "t4g.small"              # ARM-based instance
  subnet_id     = aws_subnet.public.id

  key_name = aws_key_pair.deployer.key_name
  
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name
  vpc_security_group_ids = [aws_security_group.ec2.id]
  
  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  user_data = <<-EOF
          #!/bin/bash
          yum update -y
          yum install -y docker
          systemctl start docker
          systemctl enable docker
          
          # Add ec2-user to docker group
          usermod -aG docker ec2-user
          
          # Install docker-compose
          curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
          chmod +x /usr/local/bin/docker-compose
          
          # AWS CLI for ECR login
          yum install -y aws-cli
          
          # Create docker-compose.yml
          cat <<'EOT' > /home/ec2-user/docker-compose.yml
          version: '3'
          services:
            frontend:
              image: ${aws_ecr_repository.frontend.repository_url}:latest
              ports:
                - "80:80"
              restart: always
            
            backend:
              image: ${aws_ecr_repository.backend.repository_url}:latest
              ports:
                - "8000:8000"
              restart: always
              volumes:
                - ./data:/app/data
          EOT
          
          # Set correct permissions
          chown -R ec2-user:ec2-user /home/ec2-user
          EOF

  tags = {
    Name = "${var.project_name}-instance"
  }
}

# Route 53 configuration
data "aws_route53_zone" "main" {
  zone_id      = "Z09688151ZGBXFPQQW4BB"
  private_zone = false
}

resource "aws_route53_record" "main" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = "300"
  records = [aws_eip.app.public_ip]  # Use EIP instead of instance public IP

  depends_on = [
    aws_instance.app,
    aws_eip.app
  ]
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"
  ttl     = "300"
  records = [aws_eip.app.public_ip]  # Use EIP instead of instance public IP

  depends_on = [
    aws_instance.app,
    aws_eip.app
  ]
}

# Add an Elastic IP
resource "aws_eip" "app" {
  instance = aws_instance.app.id

  tags = {
    Name = "${var.project_name}-eip"
  }
}