"use_strict";
import * as vscode from 'vscode';
import * as path from 'path';

import { workspace, Disposable, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions, 
	TransportKind, TextEdit,RequestType, TextDocumentIdentifier, ResponseError, 
	InitializeError, State as ClientState, NotificationType, ForkOptions } from 'vscode-languageclient';

//
// client activation function, this is the entrypoint for the client
//
export function activate(context: vscode.ExtensionContext) : void  {
		console.log('Started EPL language server');

	//Sample command from initial 'yo code' generation - left just in case someone wants to use it. 
	let command1: Disposable = vscode.commands.registerCommand('extension.eplWelcome', () => {
		vscode.window.showInformationMessage('Welcome to EPL');
	});

	// The server is implemented in server.ts - built when this is built
	let serverModule: string = context.asAbsolutePath(path.join('out','server.js'));
	// The debug options for the server
	let debugOptions: ForkOptions = { execArgv: ["--nolazy", "--inspect=6009"] };
	
	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the  normal ones are used
	let serverOptions: ServerOptions = {
		run : { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
	};
	
	// Options of the language client
	let clientOptions: LanguageClientOptions = {
		// Activate the server for epl files
		documentSelector: ['epl'],
		synchronize: {
			// Synchronize the section 'eplLanguageServer' of the settings to the server
			configurationSection: 'eplLanguageServer',
			// Notify the server about file changes to epl files contained in the workspace
			// need to think about this
			// fileEvents: workspace.createFileSystemWatcher('**/.epl')
		}
	};
	
	// Create the language client and start the client.
	let langServer: Disposable = new LanguageClient('eplLanguageServer', 'Language Server', serverOptions, clientOptions).start();
	
	// Push the disposable to the context's subscriptions so that the 
	// client can be deactivated on extension deactivation
	context.subscriptions.push(command1);
	context.subscriptions.push(langServer);
}

// this method is called when your extension is deactivated
export function deactivate() {}
