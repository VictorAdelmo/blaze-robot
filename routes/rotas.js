const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");

router.get("/analisarPagina/", function(req,res){
    return res.render("inicio");
});
router.post("/analisar/",controller.analisarController);

module.exports = router;