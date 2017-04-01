angular.module('contextApp').component('prodComponent', {
      templateUrl: "./views/prodComponent/prodComponent.html",
      controller: function(prodService){
        this.user = {name: 'Hello world'}
      }
})
