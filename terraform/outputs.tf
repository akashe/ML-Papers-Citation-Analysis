output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.app.id
}

output "elastic_ip" {
  description = "Elastic IP of the EC2 instance"
  value       = trimspace(aws_eip.app.public_ip)
}

output "ecr_frontend_repository_url" {
  description = "URL of the frontend ECR repository"
  value       = aws_ecr_repository.frontend.repository_url
}

output "ecr_backend_repository_url" {
  description = "URL of the backend ECR repository"
  value       = aws_ecr_repository.backend.repository_url
}

output "domain_name" {
  description = "Domain name"
  value       = var.domain_name
}

output "ssh_connection_string" {
  description = "SSH connection string for the EC2 instance"
  value       = "ssh -i ~/.ssh/citation-network/deploy_key ec2-user@${aws_eip.app.public_ip}"
}