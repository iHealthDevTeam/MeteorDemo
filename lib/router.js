/**
 * Created by shen on 15/9/13.
 */


Router.map(function () {
    this.route('home', {
        path: '/',  //overrides the default '/home'
        template: "home"
    });
    this.route('admin', {

        path: '/admin',
        template: "adminBoard"
    });
});
