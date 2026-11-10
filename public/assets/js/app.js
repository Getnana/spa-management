(async function init() {
    const isAuth = await auth.check();

    if (isAuth) {
        sidebar.render();
        header.render();
        header.startNotificationPolling();
    }

    router.handleRoute();
})();
