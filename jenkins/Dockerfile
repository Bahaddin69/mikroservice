FROM jenkins/jenkins:lts

# root olarak sistem paketleri yüklemek (git, openssh vb.)
USER root
RUN apt-get update -qq \
    && apt-get install -qqy --no-install-recommends \
    git \
    openssh-client \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Jenkins kullanıcıya geri dön
USER jenkins

# Plugin listemizi kullanarak jenkins-plugin-cli ile pluginleri kur
# plugins.txt dosyası /usr/share/jenkins/ref/plugins.txt içine kopyalanır.
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt

# Portlar
EXPOSE 8080 50000
