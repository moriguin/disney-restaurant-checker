FROM mcr.microsoft.com/playwright:v1.42.1-jammy

WORKDIR /app
COPY ../ .

RUN yarn install
RUN npx playwright install --with-deps

CMD ["yarn", "start"]
