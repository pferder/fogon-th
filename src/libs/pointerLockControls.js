/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 */
module.exports = (THREE) => {
    THREE.PointerLockControls = function (camera, domElement) {

        if (domElement === undefined) {

            console.warn('THREE.PointerLockControls: The second parameter "domElement" is now mandatory.');
            domElement = document.body;

        }

        this.domElement = domElement;
        this.isLocked = false;

        //
        // internals
        //

        var scope = this;

        var changeEvent = { type: 'change' };
        var lockEvent = { type: 'lock' };
        var touchLockEvent = { type: 'touch_lock' };
        var unlockEvent = { type: 'unlock' };

        var euler = new THREE.Euler(0, 0, 0, 'YXZ');

        var PI_2 = Math.PI / 2;

        var vec = new THREE.Vector3();

        function onMouseMove(event) {

            if (scope.isLocked === false) return;

            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            euler.setFromQuaternion(camera.quaternion);

            euler.y -= movementX * 0.002;
            euler.x -= movementY * 0.002;

            euler.x = Math.max(- PI_2, Math.min(PI_2, euler.x));

            camera.quaternion.setFromEuler(euler);

            scope.dispatchEvent(changeEvent);

        }

        function onTouchStart(event) {
          this.last_touch = event.touches[0];
        }

        function onTouchEnd(event) {
          this.last_touch = null;
          this.multi = null;
          document.dispatchEvent(new KeyboardEvent('keyup', {keyCode: 38}));
          document.dispatchEvent(new KeyboardEvent('keyup', {keyCode: 40}));
        }

        function onTouchMove(event) {
            var touches = event.changedTouches;
            if (touches.length == 0) return;

            var first_touch = touches[0];
            var movementY = first_touch.pageY - this.last_touch.pageY || 0;

            if (touches.length > 1) {
              if (!this.multi) {
                if (movementY < 0) {
                  this.multi = new KeyboardEvent('keydown', {keyCode: 38})
                } else {
                  this.multi = new KeyboardEvent('keydown', {keyCode: 40})
                }
              }
              document.dispatchEvent(this.multi);
            }

            var movementX = first_touch.pageX - this.last_touch.pageX || 0;
            if (!this.multi) {
              var movementY = first_touch.pageY - this.last_touch.pageY || 0;
            } else {
              var movementY = 0;
            }
            this.last_touch = first_touch;

            euler.setFromQuaternion(camera.quaternion);

            euler.y -= movementX * 0.002;
            euler.x -= movementY * 0.002;

            euler.x = Math.max(- PI_2, Math.min(PI_2, euler.x));

            camera.quaternion.setFromEuler(euler);

            scope.dispatchEvent(changeEvent);
        }

        function onPointerlockChange() {

            if (document.pointerLockElement === scope.domElement) {

                scope.dispatchEvent(lockEvent);

                scope.isLocked = true;

            } else {

                scope.dispatchEvent(unlockEvent);

                scope.isLocked = false;

            }

        }

        function onPointerlockError() {

            console.error('THREE.PointerLockControls: Unable to use Pointer Lock API');
            this.connect_touch();
        }

        this.connect = function () {

            document.addEventListener('mousemove', onMouseMove, false);
            document.addEventListener('pointerlockchange', onPointerlockChange, false);
            document.addEventListener('pointerlockerror', onPointerlockError.bind(this), false);

        };

        this.connect_touch = function () {
            this.container = document.getElementById('scene-container');
            this.container.addEventListener('touchmove', onTouchMove.bind(this), false);
            this.container.addEventListener('touchstart', onTouchStart.bind(this), false);
            this.container.addEventListener('touchend', onTouchEnd.bind(this), false);
            scope.dispatchEvent(touchLockEvent);
            this.last_touch = null;
            this.multi = false;
            this.isLocked = true;
            document.getElementById('controles-pc').style.display = "none";
            document.getElementById('controles-celu').style.display = "block";
        }

        this.disconnect = function () {

            document.removeEventListener('mousemove', onMouseMove, false);
            document.removeEventListener('pointerlockchange', onPointerlockChange, false);
            document.removeEventListener('pointerlockerror', onPointerlockError, false);

        };

        this.dispose = function () {

            this.disconnect();

        };

        this.getObject = function () { // retaining this method for backward compatibility

            return camera;

        };

        this.getDirection = function () {

            var direction = new THREE.Vector3(0, 0, - 1);

            return function (v) {

                return v.copy(direction).applyQuaternion(camera.quaternion);

            };

        }();

        this.moveForward = function (distance) {

            // move forward parallel to the xz-plane
            // assumes camera.up is y-up

            vec.setFromMatrixColumn(camera.matrix, 0);

            vec.crossVectors(camera.up, vec);

            camera.position.addScaledVector(vec, distance);

        };

        this.moveRight = function (distance) {

            vec.setFromMatrixColumn(camera.matrix, 0);

            camera.position.addScaledVector(vec, distance);

        };

        this.lock = function () {

            this.domElement.requestPointerLock();

        };

        this.unlock = function () {

            document.exitPointerLock();

        };

        this.connect();

    };

    THREE.PointerLockControls.prototype = Object.create(THREE.EventDispatcher.prototype);
    THREE.PointerLockControls.prototype.constructor = THREE.PointerLockControls;

}
