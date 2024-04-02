const Router = require('express');
const router = Router();
const UserControllers = require('../controller/UserControllers');
const auth = require("../middleware/auth")
// const multer = require('../middleware/multer-config');

router.post('/', UserControllers.createUser);

router.get('/:idUser', UserControllers.getUser);
 
router.get('/', UserControllers.getAllUser);

router.patch('/:idUser', UserControllers.updateUser);

router.delete('/:idUser', UserControllers.deleteUser);

module.exports = router;
