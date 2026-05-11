import { execSync } from 'child_process';
export const execCommand = (command) => {
    try {
        const stdout = execSync(command);
        return stdout;
    }
    catch (error) {
        throw new Error(`${error}`);
    }
};
