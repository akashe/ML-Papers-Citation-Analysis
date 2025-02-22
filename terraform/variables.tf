variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "citation-network"
}

variable "environment" {
  description = "Environment (dev/prod)"
  type        = string
  default     = "prod"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-east-1a"]  # Single AZ for cost optimization
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "paperverse.co"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t4g.small"  # ARM-based instance for better price/performance
}

variable "instance_ami" {
  description = "AMI ID for EC2 instance"
  type        = string
  default     = "ami-0f37c4a1ba152af46"  # Amazon Linux 2023 ARM64
}

variable "root_volume_size" {
  description = "Size of the root volume in GB"
  type        = number
  default     = 30
}

variable "root_volume_type" {
  description = "Type of the root volume"
  type        = string
  default     = "gp3"
}

variable "tags" {
  description = "Default tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "citation-network"
    Environment = "prod"
    ManagedBy   = "terraform"
  }
}

variable "ssl_email" {
  description = "Email address for SSL certificate notifications"
  type        = string
  default     = "your-email@example.com"  # Remember to change this
}