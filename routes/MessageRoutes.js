const Router = require('express');
const router = Router();
const MessageControllers = require('../controller/MessageControllers');
// const multer = require('../middleware/multer-config');

router.post('/', MessageControllers.createMessage);

router.get('/:idMessage', MessageControllers.getMessage);

router.get('/', MessageControllers.getAllMessageGroupe);

router.patch('/:idMessage', MessageControllers.updateMessage);

router.delete('/:idMessage', MessageControllers.deleteMessage);

module.exports = router;
