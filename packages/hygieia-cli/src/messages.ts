export default {
    ProjectName: 'Project name:',
    ShouldOverwriteDirectory: (targetDir: string) =>
        (targetDir === '.' ? 'Current directory' : `Target directory "${targetDir}"`) +
        ' is not empty. Remove existing files and continue?',
    UseRecommendedTSConfig: 'Install recommended tsconfig.json file with recommended settings?',
} as const;
