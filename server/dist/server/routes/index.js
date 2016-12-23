/// <reference path="../../../typings/index.d.ts" />
"use strict";
var RoutesComponent = (function () {
    function RoutesComponent() {
    }
    RoutesComponent.prototype.home = function (req, res) {
        res.sendFile('index.html', { root: '/' });
    };
    ;
    return RoutesComponent;
}());
exports.RoutesComponent = RoutesComponent;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZlci9yb3V0ZXMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0RBQW9EOztBQUlwRDtJQUFBO0lBTUEsQ0FBQztJQUpHLDhCQUFJLEdBQUosVUFBSyxHQUFvQixFQUFFLEdBQXFCO1FBQzVDLEdBQUcsQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQzs7SUFFTCxzQkFBQztBQUFELENBTkEsQUFNQyxJQUFBO0FBTlksdUJBQWUsa0JBTTNCLENBQUEiLCJmaWxlIjoic2VydmVyL3JvdXRlcy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi90eXBpbmdzL2luZGV4LmQudHNcIiAvPlxuXG5pbXBvcnQgZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xuXG5leHBvcnQgY2xhc3MgUm91dGVzQ29tcG9uZW50IHtcbiAgXG4gICAgaG9tZShyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlKSB7XG4gICAgICAgIHJlcy5zZW5kRmlsZSgnaW5kZXguaHRtbCcsIHtyb290OiAnLyd9KTtcbiAgICB9O1xuXG59XG5cblxuIl19
