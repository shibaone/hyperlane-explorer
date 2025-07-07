variable "DOCKER_REGISTRY" {
  default = "ghcr.io/hyperlane-xyz"
}

variable "IMAGE_NAME" {
  default = "explorer"
}

variable "VERSION" {
  default = "latest"
}

variable "TARGETPLATFORM" {
  default = "linux/amd64"
}

group "default" {
  targets = ["explorer"]
}

target "explorer" {
  context = "."
  dockerfile = "Dockerfile"
  platforms = ["linux/amd64"]
  tags = [
    "${DOCKER_REGISTRY}/${IMAGE_NAME}:${VERSION}",
    "${DOCKER_REGISTRY}/${IMAGE_NAME}:latest"
  ]
  args = {
    # Next.js public variables
    NEXT_PUBLIC_VERSION = ""
    NEXT_PUBLIC_API_URL = ""
    
    # Registry configuration
    REGISTRY_URI = "https://github.com/shibaone/hyperlane-registry"
    REGISTRY_BRANCH = "devnet-v4"
    REGISTRY_AUTH_TOKEN = ""
    
    # Explorer API keys (JSON string)
    EXPLORER_API_KEYS = "{}"
    
    # Node environment
    NODE_ENV = "production"
  }
  output = ["type=docker"]
} 