FROM mcr.microsoft.com/playwright:v1.42.1-jammy

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install
RUN npx playwright install --with-deps
RUN apt update && apt install -y xvfb

COPY . .