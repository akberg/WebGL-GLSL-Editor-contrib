import { ExtensionContext, languages, window, workspace } from 'vscode';
import { Documentation } from './builtin/documentation';
import { Constants } from './core/constants';
import { GlslEditor } from './core/glsl-editor';
import { addSharedCommands, addSharedFeatures, selector } from './extension';
import { HostDependent } from './host-dependent';
import { GlslDiagnosticProvider } from './providers/glsl-diagnostic-provider';
import { GlslFileDecorationProvider } from './providers/glsl-file-decoration-provider';
import { GlslInjectionErrorProvider } from './providers/glsl-injection-error-provider';
import { GlslTextProvider } from './providers/glsl-text-provider';

export function activate(context: ExtensionContext): void {
    GlslEditor.initialize(context);
    addHostDependentCode();
    addDiagnostic(context);
    addSharedCommands(context);
    addFeatures(context);
    addSharedFeatures(context);
}

function addHostDependentCode(): void {
    HostDependent.getDocumentation = (name, uri) => Documentation.getDocumentation(name, uri);
    HostDependent.textChanged = (document) => new GlslDiagnosticProvider().textChanged(document);
    HostDependent.displayPreprocessedCode = (document) =>
        new GlslDiagnosticProvider().displayPreprocessedCode(document);
}

function addDiagnostic(context: ExtensionContext): void {
    //diagnostic
    for (const editor of window.visibleTextEditors) {
        if (editor.document.languageId === Constants.GLSL) {
            try {
                new GlslDiagnosticProvider().textChanged(editor.document);
            } catch (error) {
                //if i catch the error here, it can't break the activation
            }
        }
    }
    context.subscriptions.push(
        workspace.onDidOpenTextDocument((event) => {
            if (event.languageId === Constants.GLSL) {
                new GlslDiagnosticProvider().textChanged(event);
            }
        })
    );
    context.subscriptions.push(
        workspace.onDidCloseTextDocument((event) => {
            if (event.languageId === Constants.GLSL) {
                GlslEditor.getDiagnosticCollection().delete(event.uri);
            }
        })
    );
    context.subscriptions.push(
        workspace.onDidChangeTextDocument((event) => {
            if (event.document.languageId === Constants.GLSL) {
                new GlslDiagnosticProvider().textChanged(event.document);
            }
        })
    );
    context.subscriptions.push(languages.registerCodeLensProvider(selector, new GlslInjectionErrorProvider()));
}

function addFeatures(context: ExtensionContext): void {
    //preprocessed glsl
    context.subscriptions.push(
        workspace.registerTextDocumentContentProvider(Constants.PREPROCESSED_GLSL, new GlslTextProvider())
    );
    window.registerFileDecorationProvider(new GlslFileDecorationProvider());
}
