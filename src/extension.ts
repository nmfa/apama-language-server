"use_strict";

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { workspace, Disposable, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions, 
	TransportKind, TextEdit,RequestType, TextDocumentIdentifier, ResponseError, 
	InitializeError, State as ClientState, NotificationType, ForkOptions } from 'vscode-languageclient';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) : void  {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "apama-language-server" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let command1: Disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});

	// The server is implemented in another project and outputted there
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
			// Synchronize the section 'dotLanguageServer' of the settings to the server
			configurationSection: 'eplLanguageServer',
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};
	
	// Create the language client and start the client.
	let langServer: Disposable = new LanguageClient('dotLanguageServer', 'Language Server', serverOptions, clientOptions).start();
	
	// Push the disposable to the context's subscriptions so that the 
	// client can be deactivated on extension deactivation
	context.subscriptions.push(command1);
	context.subscriptions.push(langServer);
}

// this method is called when your extension is deactivated
export function deactivate() {}
