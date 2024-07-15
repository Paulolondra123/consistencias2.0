FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Sobrescribir los archivos modificados dentro de node_modules
COPY modified_node_modules/select2/dist/css/select2.css node_modules/select2/dist/css/select2.css
COPY modified_node_modules/select2/dist/css/select2.min.css node_modules/select2/dist/css/select2.min.css

COPY modified_node_modules/datatables.net-dt/css/dataTables.dataTables.css node_modules/datatables.net-dt/css/dataTables.dataTables.css
COPY modified_node_modules/datatables.net-dt/css/dataTables.dataTables.min.css node_modules/datatables.net-dt/css/dataTables.dataTables.min.css

CMD ["npm", "start"]