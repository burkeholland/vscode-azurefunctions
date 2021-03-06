/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fse from 'fs-extra';
import * as path from 'path';
import { Progress } from 'vscode';
import { confirmOverwriteFile } from "../../../utils/fs";
import { IProjectWizardContext } from '../IProjectWizardContext';
import { ScriptProjectCreateStep } from './ScriptProjectCreateStep';

const profileps1FileName: string = 'profile.ps1';
const requirementspsd1FileName: string = 'requirements.psd1';

const profileps1: string = `# Azure Functions profile.ps1
#
# This profile.ps1 will get executed every "cold start" of your Function App.
# "cold start" occurs when:
#
# * A Function App starts up for the very first time
# * A Function App starts up after being de-allocated due to inactivity
#
# You can define helper functions, run commands, or specify environment variables
# NOTE: any variables defined that are not environment variables will get reset after the first execution

# Authenticate with Azure PowerShell using MSI.
# Remove this if you are not planning on using MSI or Azure PowerShell.
if ($env:MSI_SECRET -and (Get-Module -ListAvailable Az.Accounts)) {
    Connect-AzAccount -Identity
}

# Uncomment the next line to enable legacy AzureRm alias in Azure PowerShell.
# Enable-AzureRmAlias

# You can also define functions or aliases that can be referenced in any of your PowerShell functions.
`;

const requirementspsd1: string = `# This file enables modules to be automatically managed by the Functions service.
# See https://aka.ms/functionsmanageddependency for additional information.
#
@{
    'Az' = '3.*'
}`;

export class PowerShellProjectCreateStep extends ScriptProjectCreateStep {
    protected supportsManagedDependencies: boolean = true;

    public async executeCore(context: IProjectWizardContext, progress: Progress<{ message?: string | undefined; increment?: number | undefined }>): Promise<void> {
        await super.executeCore(context, progress);

        const profileps1Path: string = path.join(context.projectPath, profileps1FileName);
        if (await confirmOverwriteFile(profileps1Path)) {
            await fse.writeFile(profileps1Path, profileps1);
        }

        const requirementspsd1Path: string = path.join(context.projectPath, requirementspsd1FileName);
        if (await confirmOverwriteFile(requirementspsd1Path)) {
            await fse.writeFile(requirementspsd1Path, requirementspsd1);
        }
    }
}
