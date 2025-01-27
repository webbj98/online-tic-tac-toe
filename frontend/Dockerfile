FROM node:21

WORKDIR /app

WORKDIR /app/frontend

COPY frontend/package*.json ./

WORKDIR /app/shared

COPY ./shared/package*.json .

RUN npm install

COPY ./shared .

WORKDIR /app/frontend

RUN npm ci

COPY ./frontend/ .

# why was this not suggested in chapt gpt ASKED
ENV PORT=4173

# TODO: undrestand WHY AND IF NEED TTO PORT MAP
EXPOSE 4173

# RUN npm run build

CMD ["npm", "run", "preview"]