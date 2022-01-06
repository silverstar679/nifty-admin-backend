"use strict";

const express = require("express");
const { ErrorTemplate, ResponseConstructor } = require("../../utils");
const { accessDenied, errorResponse } = ErrorTemplate;
const CONTRACT = require("./contract");
const authorize = require("../authorize");

/**
 * Router object
 */
const router = express.Router();

/**
 * Get All
 * @type {[type]}
 */
router.get("/", async (req, res) => {
  try {
    const { results, paging } = await CONTRACT.query(req.query);

    return ResponseConstructor(
      res,
      req,
      200,
      undefined,
      results.map((a) => a.export()),
      undefined,
      paging
    );
  } catch (e) {
    return errorResponse(res, e, req);
  }
});

/**
 * Get CONTRACT to pass
 * @type {[type]}
 */
router.use("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const contract = await CONTRACT.findById(id);

    if (contract) {
      res.locals.contract = contract;
      return next();
    }
    const err = new Error(`No CONTRACT found with ID: ${id}`);

    err.status = 404;
    return errorResponse(res, err, req);
  } catch (e) {
    return errorResponse(res, e, req);
  }

  return accessDenied(req, res);
});

/**
 * Get By ID
 * @type {[type]}
 */
router.get("/:id", async (req, res) => {
  const { contract } = res.locals;

  return ResponseConstructor(res, req, 200, undefined, contract.export());
});

// /**
//  * Validation
//  * @type {[type]}
//  */
// router.use((req, res, next) => {
//   return authorize(req, (e, pass) => {
//     if (e || !pass) {
//       return errorResponse(res, e, req);
//     }
//     return next();
//   });
// });

/**
 * Create
 * @type {[type]}
 */
router.post("/", async (req, res) => {
  const { body } = req;

  try {
    const contract = await CONTRACT.create(body, res);

    return ResponseConstructor(res, req, 201, undefined, contract.export());
  } catch (e) {
    return errorResponse(res, e, req);
  }
});

/**
 * Update By ID
 * @type {[type]}
 */
router.put("/:id", async (req, res) => {
  let { contract } = res.locals;
  const { body } = req;

  try {
    contract = await contract.update(body, res);

    return ResponseConstructor(res, req, 201, undefined, contract.export());
  } catch (e) {
    return errorResponse(res, e, req);
  }
});
/**
 * Delete By ID
 * @type {[type]}
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await CONTRACT.findByIdAndDelete(id);
    return ResponseConstructor(res, req, 204, "CONTRACT deleted");
  } catch (e) {
    return errorResponse(res, err, req);
  }
});

module.exports = router;
