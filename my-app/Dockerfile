# Step 1: Use the official Nginx image
FROM nginx:alpine

# Step 2: Copy build files to Nginx's default public directory
COPY build /usr/share/nginx/html

# Step 3: Copy custom Nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Step 4: Expose port 80
EXPOSE 80

# Step 5: Start Nginx
CMD ["nginx", "-g", "daemon off;"]
