CREATE TABLE automacao (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    cliente_id INTEGER NOT NULL,

    CONSTRAINT fk_automacao_cliente
        FOREIGN KEY(cliente_id)
        REFERENCES clientes(id)

)