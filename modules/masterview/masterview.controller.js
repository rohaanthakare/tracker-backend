const MasterViewService = require('./masterview.service');

module.exports = {
    create_view_config,
    getNavigationMenu
}

async function create_view_config(req, res) {
    let master_view = await MasterViewService.create_view(req.body);
    if (master_view) {
        res.send({
            status: true,
            master_view
        });
    }
}

async function getNavigationMenu(req, res) {
    let menus = await MasterViewService.getNavigationMenu(req.current_user);
    res.send({
        status: true,
        menus
    });
}