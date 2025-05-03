# Justfile for Hugo blog automation

# Create a new Hugo post
# Usage: just create "my-post-title"
create post-name:
    @echo "Creating new Hugo post: {{post-name}}"
    mkdir -p content/posts/{{post-name}}
    hugo new content content/posts/{{post-name}}/index.md 