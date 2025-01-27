FROM node:21

WORKDIR /app 

WORKDIR /app/backend

COPY backend/package*.json .

WORKDIR /app/shared

COPY ./shared/package*.json .

# WORKDIR /app

RUN npm install

COPY ./shared/ .

WORKDIR /app/backend

# npm install
RUN npm ci


# ERROR HAS TO DO WITH BACKEND COPYING
# ERROR HAPPENS WHEN NODE_MODULES IS COPIED
COPY ./backend/ .

# WORKDIR /app/shared

# RUN npm run build

# WORKDIR /app/backend

# COPY . .

# # COPY ../shared/ ../shared

# # RUN ../shared && npm run build

# WORKDIR /app/backend/dist

# RUN ls -la

# why was this not suggested in chapt gpt ASKED
ENV PORT=3001

# TODO: undrestand WHY AND IF NEED TTO PORT MAP
EXPOSE 3001

CMD ["npm", "run", "start"]