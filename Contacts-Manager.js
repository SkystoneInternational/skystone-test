Contacts = new Mongo.Collection('contacts');

if (Meteor.isClient) {

    // This code only runs on the client
    angular.module('contact-manager', ['angular-meteor']);

    angular.module('contact-manager').controller('ContactCtrl', ['$scope', '$meteor',
      function ($scope, $meteor) {

          $scope.showSave = false;
          $scope.showModal = false;
          $scope.contacts = $meteor.collection(function () {
              return Contacts.find({}, { sort: { date: 1 } })
          });
          $scope.toggleModal = function (id) {
              $scope.showModal = !$scope.showModal;
              $scope.id = id;
          };

          $scope.addContact = function (saveContact) {
              $scope.contacts.push({
                  firstName: saveContact.firstName,
                  lastName: saveContact.lastName,
                  phone: saveContact.phone,
                  email: saveContact.email,
                  division: saveContact.division,
                  date: new Date()
              }
              );
              this.saveContact = null;
              $scope.$setPristine(true);
          };

          $scope.editContact = function (contact) {
              $scope.saveContact = angular.copy(contact);
              $scope.showSave = true;
          };

          $scope.updateContact = function (saveContact) {
              $scope.showSave = false;
              Contacts.update(
              { "_id": saveContact._id },
              {
                  $set: {
                      firstName: saveContact.firstName,
                      lastName: saveContact.lastName,
                      phone: saveContact.phone,
                      email: saveContact.email,
                      division: saveContact.division,
                  },
              });
              this.saveContact = null;
              $scope.$setPristine(true);
          }

          $scope.removeRow = function () {
              Contacts.remove({ "_id": $scope.id });
          };

          $scope.divisions = ["Business Development",
                              "Asset Integrity",
                              "Emergency Management",
                              "Pipeline Integrity & Engineering",
                              "Cathodic Protection",
                              "Integrity Projects",
                              "Laboratory",
                              "Human Resources",
                              "Training"]


      }]);

    angular.module('contact-manager').directive('modal', function () {
        return {
            template: '<div class="modal fade">' +
                '<div class="modal-dialog">' +
                  '<div class="modal-content">' +
                    '<div class="modal-header">' +
                      '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                      '<h4 class="modal-title">{{ title }}</h4>' +
                    '</div>' +
                    '<div class="modal-body" ng-transclude></div>' +
                  '</div>' +
                '</div>' +
              '</div>',
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: true,
            link: function postLink(scope, element, attrs) {
                scope.title = attrs.title;

                scope.$watch(attrs.visible, function (value) {
                    if (value == true)
                        $(element).modal('show');
                    else
                        $(element).modal('hide');
                });

                $(element).on('shown.bs.modal', function () {
                    scope.$apply(function () {
                        scope.$parent[attrs.visible] = true;
                    });
                });

                $(element).on('hidden.bs.modal', function () {
                    scope.$apply(function () {
                        scope.$parent[attrs.visible] = false;
                    });
                });
            }
        };
    });
}