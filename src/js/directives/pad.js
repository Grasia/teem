'use strict';

/**
 * @ngdoc function
 * @name Teem.controller:ChatCtrl
 * @description
 * # Chat Ctrl
 * Show Pad for a given project
 */
let timer;
angular.module('Teem')
  .directive('pad', function () {
    return {
      scope: true,
      link: function ($scope, elem, attrs) {
        $scope.editingDefault = attrs.editingDefault;
      },
      controller: [
        'SessionSvc', '$rootScope', '$scope', '$route', '$location',
        '$timeout', 'SharedState', 'needWidget', '$element', 'linkPreview',
        function (SessionSvc, $rootScope, $scope, $route, $location,
                  $timeout, SharedState, needWidget, $element, linkPreview) {

          var buttons = ['text_fields', 'format_bold', 'format_italic', 'format_strikethrough',
            'format_align_left', 'format_align_center', 'format_align_right',
            'format_list_bulleted', 'format_list_numbered'];

          var annotationMap = {
            'text_fields': 'paragraph/header=h3',
            'format_bold': 'style/fontWeight=bold',
            'format_italic': 'style/fontStyle=italic',
            'format_strikethrough': 'style/textDecoration=line-through',
            'format_align_left': 'paragraph/textAlign=left',
            'format_align_center': 'paragraph/textAlign=center',
            'format_align_right': 'paragraph/textAlign=right',
            'format_list_bulleted': 'paragraph/listStyleType=unordered',
            'format_list_numbered': 'paragraph/listStyleType=decimal'
          };

          var annotations = {};

          function openLinkPopover(event, range) {
            timer = $timeout(() => {
              event.stopPropagation();
              let div = document.createElement('div');
              let btn = event.target;
              //cannot inject the spinner HTML directly here
              let inHTML = `
          <style>
          .pos-r{
            position relative;
            margin: 150px 0;
          }
          </style>
          <div class="pos-r">
          <div class="spinner-container">
          <svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
          <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
          </svg>
          </div>
          </div>
          `;
              linkPreview.getMetaData(btn.href)
                .then((meta) => {
                  if (!meta) {
                    div.style.display = 'none';
                    return;
                  }
                  let urlImage = meta.image,
                    urlAuthor = meta.author,
                    urlTitle = meta.title,
                    urlDescription = meta.description;
                  let innerEle = document.createElement('div');
                  if (urlImage && urlDescription) {
                    innerEle.innerHTML = document.getElementById('urlImage-and-urlDescription').innerHTML;
                    innerEle.querySelector('#popoverLinkTitle').innerHTML = urlTitle;
                    innerEle.querySelector('#popoverLinkImage').src = urlImage;
                    innerEle.querySelector('#popoverLinkDescription').innerHTML = urlDescription;
                    innerEle.querySelector('#popoverLinkUrl').innerHTML = btn.href;
                    inHTML = innerEle.innerHTML;
                  }
                  else if (urlDescription && !urlImage) {
                    div.style.height = '110px';
                    innerEle.innerHTML = document.getElementById('description-and-no-image').innerHTML;
                    innerEle.querySelector('#popoverLinkTitle').innerHTML = urlTitle;
                    innerEle.querySelector('#popoverLinkDescription').innerHTML = urlDescription;
                    innerEle.querySelector('#popoverLinkUrl').innerHTML = btn.href;
                    inHTML = innerEle.innerHTML;
                  }
                  else {
                    if (!urlTitle) {
                      div.style.height = '110px';
                      innerEle.innerHTML = document.getElementById('no-title-in-url').innerHTML;
                      innerEle.querySelector('#popoverLinkDescription').innerHTML = urlDescription;
                      innerEle.querySelector('#popoverLinkUrl').innerHTML = btn.href;
                      inHTML = innerEle.innerHTML;
                    }
                    else {
                      div.style.height = '110px';
                      innerEle.innerHTML = document.getElementById('no-title-in-url').innerHTML;
                      innerEle.querySelector('#popoverLinkTitle').innerHTML = urlTitle;
                      innerEle.querySelector('#popoverLinkDescription').innerHTML = urlDescription;
                      innerEle.querySelector('#popoverLinkUrl').innerHTML = btn.href;
                      inHTML = innerEle.innerHTML;
                    }
                  }
                  div.innerHTML = inHTML;
                })
                .catch((err) => {
                  console.log(err);
                });
              let clientRect = range.node.nextSibling ?
                range.node.nextSibling.getBoundingClientRect() :
                range.node.parentElement.getBoundingClientRect();
              div.innerHTML = inHTML;
              div.style.width = '345px';
              div.style.height = '300px';
              div.style.position = 'absolute';
              div.style.border = '1px solid #F0F0F0';
              div.style.top = clientRect.top + 35 + 'px';
              div.style.left = clientRect.left + 'px';
              div.style.zIndex = 3;
              div.style.backgroundColor = '#F2F2F2';
              div.style.paddingTop = '5px';
              div.id = 'popover-container';
              document.body.appendChild(div);
            }, 700);
          }

          function closeLinkPopover(delay) {
            if (timer) {
              $timeout.cancel(timer);
              timer = null;
              $timeout(() => {
                if (document.getElementById('popover-container')) {
                  document.body.removeChild(document.getElementById('popover-container'));
                }
              }, delay);
            }
          }

          function imgWidget(parentElement, before, state) {
            state = state || before;

            if (!(state in $scope.project.attachments) || !$scope.project.attachments[state].file) {
              return;
            }

            // cannot use spinner template directly here
            parentElement.innerHTML = `
          <div class="pos-r">
          <div class="spinner-container">
          <svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
          <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
          </svg>
          </div>
          </div>`;

            $scope.project.attachments[state].file.getUrl().then(url => {
              parentElement.innerHTML = `<img src="${url}">`;
            });
          }

          $scope.padWidgets = {
            'need': needWidget.getWidget($scope),
            'img': {
              onInit: imgWidget,
              onChangeState: imgWidget
            }
          };

          $scope.padAnnotations = {
            'paragraph/header': {
              onAdd: function () {
                $scope.pad.outline = this.editor.getAnnotationSet('paragraph/header');
                $timeout();
              },
              onChange: function () {
                $scope.pad.outline = this.editor.getAnnotationSet('paragraph/header');
                $timeout();
              },
              onRemove: function () {
                $scope.pad.outline = this.editor.getAnnotationSet('paragraph/header');
                $timeout();
              }
            },
            'link': {
              onEvent: function (range, event) {
                if (event.type === 'click') {
                  event.stopPropagation();
                  closeLinkPopover(0);
                  $scope.linkModal.open(range);
                }
                else if (event.type === 'mouseover') {
                  openLinkPopover(event, range);
                  console.log(range);
                }
                else if (event.type === 'mouseout') {
                  closeLinkPopover(500);
                }
              }
            }
          };

          function updateAllButtons() {
            for (let btn of buttons) {
              let [key, val] = annotationMap[btn].split('=');
              $scope.buttons[btn] = (annotations && annotations[key] === val);
            }
            $timeout();
          }

          function disableAllButtons() {
            $scope.buttons = {};
            buttons.forEach(btn => $scope.buttons[btn] = false);
            $timeout();
          }

          $scope.padCreate = function (editor) {

            $scope.linkModal = {
              add: function (event) {
                event.stopPropagation();
                let range = editor.getSelection();
                if (range.text) {
                  editor.setAnnotation('link', '');
                }
                $scope.linkModal.open(range);
              },
              open: function (range) {
                let annotation = editor.getAnnotationInRange(range, 'link');

                $scope.linkModal.range = range;
                $scope.linkModal.annotation = annotation;
                console.log(range);
                let clientRect = range.node.nextSibling ?
                  range.node.nextSibling.getBoundingClientRect() :
                  range.node.parentElement.getBoundingClientRect();
                document.getElementById('link-modal').style.top = clientRect.top + 25 + 'px';
                document.getElementById('link-modal').style.left = clientRect.left + 'px';

                $scope.linkModal.text = range.text;
                $scope.linkModal.link = annotation ? annotation.value : '';
                $scope.linkModal.show = true;

                let emptyInput = !range.text ? 'text' : 'link';
                let autofocus = document.querySelector('#link-modal [ng-model="linkModal.' + emptyInput + '"]');
                $timeout(() => autofocus && autofocus.focus());
              },
              change: function () {
                let range = editor.setText($scope.linkModal.range, $scope.linkModal.text);
                editor.setAnnotationInRange(range, 'link', $scope.linkModal.link);
                $scope.linkModal.show = false;
                $scope.linkModal.edit = false;
              },
              clear: function () {
                editor.clearAnnotationInRange($scope.linkModal.range, 'link');
                $scope.linkModal.show = false;
                $scope.linkModal.edit = false;
              }
            };

            disableAllButtons();

            editor.onSelectionChanged(function (range) {
              annotations = range.annotations;
              updateAllButtons();
            });
          };

          $scope.padReady = function (editor) {
            // FIXME
            // SwellRT editor is created with .wave-editor-off
            // Should use .wave-editor-on when SwellRT editor callback is available
            // https://github.com/P2Pvalue/swellrt/issues/84
            var editorElement = angular.element($element.find('.swellrt-editor').children()[0]);

            editorElement.on('focus', updateAllButtons);
            editorElement.on('blur', disableAllButtons);

            $scope.pad.outline = editor.getAnnotationSet('paragraph/header');

            $scope.annotate = function (btn) {
              let [key, val] = annotationMap[btn].split('=');
              let currentVal = annotations[key];
              if (currentVal === val) {
                val = null;
              }

              annotations[key] = val;
              editor.setAnnotation(key, val);
              editorElement.focus();
            };

            $scope.clearFormat = function () {
              editor.clearAnnotation('style');
              editorElement.focus();
            };

            $scope.widget = function (type) {
              if (type === 'need') {
                needWidget.add(editor, $scope);
              }
              if (type === 'img') {
                if (arguments[1] === undefined) { // First step
                  $scope.pad.selectingFile = true;
                  $timeout(() => $scope.pad.selectingFile = false);
                } else { // Second step
                  $scope.pad.selectingFile = false;
                  var id = $scope.project.addAttachment(arguments[1]);
                  editor.addWidget('img', id);
                }
              }
            };

            $scope.editOn = function () {
              if (editorElement.attr('class') === 'wave-editor-on') {
                $scope.pad.editing = true;
                SessionSvc.showSaving = true;
                SharedState.turnOn('hiddenTabs');
                $timeout();
              }
            };

            $scope.editOff = function () {
              if (editorElement.attr('class') === 'wave-editor-on') {
                $scope.pad.editing = $scope.editingDefault;
                SessionSvc.showSaving = false;
                SharedState.turnOff('hiddenTabs');
                $timeout();
              }
            };

            if ($scope.editingDefault && $scope.project.isParticipant()) {
              $scope.pad.editing = true;
            }

            // FIXME We should get the pad text directly from the editor, but
            // I couldn't find the proper way
            if ($scope.project.isParticipant() && $scope.project.pad.text() === '') {
              $scope.pad.emptyTip = true;
            }

          };

          $scope.$watchCollection(function () {
            return SessionSvc.status;
          }, function (current) {
            $scope.pad.saving = !current.sync;
          });

          $scope.closePadEmptyTip = function closePadEmptyTip() {
            $scope.pad.emptyTip = false;
            $timeout(() => {
              angular.element(document.querySelector('.wave-editor-on')).focus();
            });
          };

        }],
      templateUrl: 'pad.html'
    };
  });
