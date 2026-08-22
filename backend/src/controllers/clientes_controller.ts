import { Request, Response } from "express";
import { criarCliente, buscarResposavel, atualizarCliente, deletarClientes} from "../repositories/clientes_repository";


const camposPermitidos = ["nome", "cnpj", "responsavel", "email"];

export async function DeletarCliente(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!id) {
        return res.status(400).json({
            message: "Informe quem voce quer deletar"
        });
    };

    const cliente = await deletarClientes(id)
    return res.status(200).json({
        message: "Cliente deletado com sucesso",
        cliente
    });
};



export async function BuscarResposavel(req: Request, res: Response) {
    const responsavel = String(req.query.responsavel ?? "");
    if (!responsavel) {
        return res.status(400).json({
            message: "Informe o responsavel"
        });
    };
    const empresas = await buscarResposavel(responsavel);

    return res.json(empresas);
};

export async function CadastrarCliente(req: Request, res: Response) {
    const { nome, cnpj, responsavel, email} = req.body;

    if (!nome || !cnpj) {
        return res.status(400).json({
            message: "Esta faltando dados"
        })
    };
    const cliente = await criarCliente (
        nome, cnpj, responsavel, email
    )
    res.status(201).json({
        message: "Cliente cadastrato",
        cliente
    });
};

export async function EditarClientes(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campos = Object.keys(req.body);

    const campo = campos[0];
    if (!campo) {
        return res.status(400).json({
            message: "Envie um campo para atualizar"
        });
    };

    if (!camposPermitidos.includes(campo)) {
        throw new Error("Campo invalido!");
    }


    if (campos.length !==1) {
        return res.status(400).json({
            message: "Envie apenas um campo para atualizar"
        });
    };
    const valor = req.body[campo];

    const cliente = await atualizarCliente(id, campo, valor)

    return res.status(201).json({
        message: "Dados atualizados",
        cliente
    })

}