module.exports = async github => await github.rest.actions.createWorkflowDispatch({
    owner: 'Sliam123456',
    repo: 'ReadMeTesting',
    workflow_id: 'update.yml',
    ref: 'main'
});