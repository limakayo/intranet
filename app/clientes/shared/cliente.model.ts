export class Cliente {

	_id: string;
	nome: string;
	color: string = "#ffffff";

	constructor(
		_id: string,
		nome: string,
		color: string) {
			this._id = _id;
			this.nome = nome;
			this.color = color;
		}

}
