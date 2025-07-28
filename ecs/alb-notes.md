# ALB Notes

- Create an Application Load Balancer in the same VPC and public subnets.
- Target group: IP type, HTTP:8080, health check path /health, success codes 200-399.
- In the ECS service wizard, select this target group.
- During rolling deploys ECS will keep the old task until the new one is healthy, then drain.
