FROM ubuntu:jammy

ENV DEBIAN_FRONTEND=noninteractive TZ=Asia/Ho_Chi_Minh

# Update package list
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y curl wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js and NestJS
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash && \
    export NVM_DIR="$HOME/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && \
    nvm install 22 && \
    npm i -g @nestjs/cli
    # npm i -D @types/multer

# Install postgresql
RUN apt-get update && apt-get install -y postgresql postgresql-contrib && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Zsh
RUN apt-get update && apt-get install -y zsh && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* \
    source ~/.zshrc

# Install Oh My Zsh
# Uses "Spaceship" theme with some customization. Uses some bundled plugins and installs some more from github
RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.2.1/zsh-in-docker.sh)" -- \
    -t https://github.com/denysdovhan/spaceship-prompt \
    -a 'SPACESHIP_PROMPT_ADD_NEWLINE="false"' \
    -a 'SPACESHIP_PROMPT_SEPARATE_LINE="false"' \
    -p git \
    -p https://github.com/zsh-users/zsh-autosuggestions \
    -p https://github.com/zsh-users/zsh-completions

# Copy the setup script
COPY setup_postgres.sh /usr/local/bin/

# Make the setup script executable
RUN chmod +x /usr/local/bin/setup_postgres.sh

# Run the setup script
RUN /usr/local/bin/setup_postgres.sh

# Start postgresql service
CMD service postgresql start && tail -f /dev/null