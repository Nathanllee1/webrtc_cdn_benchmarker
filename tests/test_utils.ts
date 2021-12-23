
export const deep_copy = (json:object) => {
    return (JSON.parse(JSON.stringify(json)));
}