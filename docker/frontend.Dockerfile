FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY citation-network-ui/package*.json ./

# Install dependencies
RUN npm install


ENV NODE_ENV=production
ENV REACT_APP_BACKEND_URL=/api

# Copy source code
COPY citation-network-ui/ ./

# Build the application
RUN npm run build

# Production environment
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]