# ECS Service Settings (if you deploy on AWS later)

- Launch type: Fargate
- Platform version: LATEST
- Desired tasks: 1
- Deployment type: Rolling update
  - Minimum healthy percent: 100
  - Maximum percent: 200
- Networking: awsvpc with 2 subnets
- Load balancer: Optional ALB, HTTP target group on port 8080, health path /health
