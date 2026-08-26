CREATE TABLE jobs (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    automacao_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    resultado VARCHAR(150),
    erro VARCHAR(150),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    iniciado_em TIMESTAMP,
    finalizado_em TIMESTAMP,

    CONSTRAINT fk_job_automacao
        FOREIGN KEY (automacao_id)
        REFERENCES  automacao(id)

);