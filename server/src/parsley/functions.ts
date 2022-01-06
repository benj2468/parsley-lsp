import { exec } from 'child_process';
import { Diagnostic } from 'vscode-languageserver';

export async function executeTypeChecker(filename: string): Promise<string> {
	return new Promise((resolve, reject) => {
		exec(`parsleyc ${filename}`, (err, data) => {
			if (err) {
				resolve(err.message);
			}
			resolve(data);
		});
	});
}

export function parseParsleyResponse(response: string): Diagnostic | undefined {
	const re = /File ".*", line (\d+), character (\d+): ((.|\n)*)/;

	const data = response.match(re);

	if (data) {
		const line = Number.parseInt(data[1]);
		const character = Number.parseInt(data[2]);
		const message = data[3];

		return {
			message,
			range: {
				start: {
					character,
					line,
				},
				end: {
					character,
					line,
				},
			},
		};
	}
}
