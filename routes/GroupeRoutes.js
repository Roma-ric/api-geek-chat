const Router = require('express');
const router = Router();
const GroupeControllers = require('../controller/GroupeControllers');
// const multer = require('../middleware/multer-config');

router.post('/', GroupeControllers.createGroupe);

router.get('/:idGroupe', GroupeControllers.getGroupe);
 
router.get('/', GroupeControllers.getAllGroupe);

router.patch('/:idGroupe', GroupeControllers.updateGroupe);

router.delete('/:idGroupe', GroupeControllers.deleteGroupe);

module.exports = router;

