FROM mcr.microsoft.com/playwright:v1.42.1-jammy

COPY ../package.json ./
COPY ../yarn.lock ./
RUN yarn install

COPY ../ .
RUN npx playwright install --with-deps

CMD ["yarn", "tsx", "src/runner.ts"]
