const withAPI = async () => {
    console.log(coolText('Running tests...'))
    // Execute the functions
    console.log(coolText('Creating directory with files...'))
    let oneFilePath = await createDirectoryWithFiles()
    console.log(
        coolText(`Running detawks against one file... (${oneFilePath}))`)
    )
    await detawks(oneFilePath)
    let testGlob = `${dirPath}/*.md`
    console.log(coolText(`Running detawks with a glob... (${testGlob})`))
    await detawks(testGlob)
    console.log(coolText('Running detawks against the whole test directory...'))
    await detawks(dirPath)
    console.log(coolText('Deleting directory and files...'))

    console.log(coolText('Tests finished!'))
}
