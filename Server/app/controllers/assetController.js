// assetController.js
const db = require("../config/db");

const assetController = {
    getAllAssets: async (req, res) => {
        try {
            const query = `
                SELECT assets.*, 
                       asset_categories.name AS category_name, 
                       users.username AS created_by_username 
                FROM assets 
                LEFT JOIN asset_categories ON assets.category_id = asset_categories.id
                LEFT JOIN users ON assets.createdBy = users.id
            `;
            const [assets] = await db.execute(query);
            res.status(200).json({ data: assets });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getAssetsByCreatedBy: async (req, res) => {
        try {
            const createdBy = req.params.createdBy;
            const query = `
                SELECT assets.*, 
                       asset_categories.name AS category_name, 
                       users.username AS created_by_username 
                FROM assets 
                LEFT JOIN asset_categories ON assets.category_id = asset_categories.id
                LEFT JOIN users ON assets.createdBy = users.id
                WHERE assets.createdBy = ?
            `;
            const [assets] = await db.execute(query, [createdBy]);
            res.status(200).json({ data: assets });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    createAsset: async (req, res) => {
        try {
            const {
                name,
                description,
                value,
                location,
                status,
                categoryId,
                quantity,
                image,
                createdBy,
            } = req.body;

            // Kiểm tra xem tên đã tồn tại chưa
            const checkQuery = "SELECT id FROM assets WHERE name = ?";
            const [existingAsset] = await db.execute(checkQuery, [name]);

            if (existingAsset.length > 0) {
                return res
                    .status(200)
                    .json({
                        message: "Asset with the same name already exists",
                    });
            }

            const query =
                "INSERT INTO assets (name, description, value, location, status, category_id, quantity, image, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            const [result] = await db.execute(query, [
                name,
                description,
                value,
                location,
                status,
                categoryId,
                quantity,
                image,
                createdBy,
            ]);

            const assetId = result.insertId;
            res.status(201).json({
                id: assetId,
                name,
                description,
                value,
                location,
                status,
                categoryId,
                quantity,
                image,
                createdBy,
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateAsset: async (req, res) => {
        try {
            const assetId = req.params.id;
            const {
                name,
                description,
                value,
                location,
                status,
                categoryId,
                image,
            } = req.body;

            // Kiểm tra xem tên đã tồn tại chưa (nếu tên được cập nhật)
            if (name) {
                const checkQuery =
                    "SELECT id FROM assets WHERE name = ? AND id != ?";
                const [existingAsset] = await db.execute(checkQuery, [
                    name,
                    assetId,
                ]);

                if (existingAsset.length > 0) {
                    return res
                        .status(200)
                        .json({
                            message: "Asset with the same name already exists",
                        });
                }
            }

            let query;
            let params;

            if (image) {
                // Nếu cung cấp hình ảnh, cập nhật bao gồm cả hình ảnh
                query =
                    "UPDATE assets SET name = ?, description = ?, value = ?, location = ?, status = ?, category_id = ?, image = ? WHERE id = ?";
                params = [
                    name,
                    description,
                    value,
                    location,
                    status,
                    categoryId,
                    image,
                    assetId,
                ];
            } else {
                // Nếu không cung cấp hình ảnh, cập nhật không bao gồm hình ảnh
                query =
                    "UPDATE assets SET name = ?, description = ?, value = ?, location = ?, status = ?, category_id = ? WHERE id = ?";
                params = [
                    name,
                    description,
                    value,
                    location,
                    status,
                    categoryId,
                    assetId,
                ];
            }

            await db.execute(query, params);
            res.status(200).json({ message: "Asset updated successfully" });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    deleteAsset: async (req, res) => {
        try {
            const assetId = req.params.id;
            const query = "DELETE FROM assets WHERE id = ?";
            await db.execute(query, [assetId]);
            res.status(200).json({ message: "Asset deleted successfully" });
        } catch (err) {
            if (err.code && err.code === "ER_ROW_IS_REFERENCED_2") {
                // Nếu lỗi do ràng buộc khóa ngoại
                res.status(200).json({
                    message:
                        "Cannot delete the asset because it is referenced in another process or event.",
                });
            } else {
                // Nếu lỗi khác
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
    },

    getAssetById: async (req, res) => {
        try {
            const assetId = req.params.id;
            const query =
                "SELECT assets.*, asset_categories.name AS category_name FROM assets LEFT JOIN asset_categories ON assets.category_id = asset_categories.id WHERE assets.id = ?";
            const [asset] = await db.execute(query, [assetId]);

            if (asset.length === 0) {
                return res.status(404).json({ message: "Asset not found" });
            }

            res.status(200).json({ data: asset[0] });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    searchAssets: async (req, res) => {
        try {
            const { keyword } = req.query;
            const searchTerm = `%${keyword}%`;
            const query =
                "SELECT * FROM assets WHERE name LIKE ? OR description LIKE ? OR location LIKE ?";
            const [assets] = await db.execute(query, [
                searchTerm,
                searchTerm,
                searchTerm,
            ]);
            res.status(200).json({ data: assets });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    approveAsset: async (req, res) => {
        try {
            const assetId = req.params.id;
            const query =
                'UPDATE assets SET approval = "approved" WHERE id = ?';
            await db.execute(query, [assetId]);
            res.status(200).json({ message: "Asset approved successfully" });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Không phê duyệt một tài sản
    unapproveAsset: async (req, res) => {
        try {
            const assetId = req.params.id;
            const query =
                'UPDATE assets SET approval = "unapproved" WHERE id = ?';
            await db.execute(query, [assetId]);
            res.status(200).json({ message: "Asset unapproved successfully" });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    registerAsset: async (req, res) => {
        try {
            const { assetId, userId } = req.body;
            // Kiểm tra xem người dùng đã đăng ký tham gia tài sản chưa
            const checkQuery =
                "SELECT * FROM asset_user WHERE asset_id = ? AND user_id = ?";
            const [existingRecord] = await db.execute(checkQuery, [
                assetId,
                userId,
            ]);
            if (existingRecord.length > 0) {
                return res
                    .status(201)
                    .json({
                        message: "User already registered for this asset",
                    });
            }

            // Thêm vào bảng liên kết
            const insertQuery =
                "INSERT INTO asset_user (asset_id, user_id) VALUES (?, ?)";
            await db.execute(insertQuery, [assetId, userId]);
            res.status(201).json({ message: "Registered successfully" });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    unregisterAsset: async (req, res) => {
        try {
            const { assetId, userId } = req.params;
            // Xóa bản ghi liên kết giữa tài sản và người dùng
            const deleteQuery =
                "DELETE FROM asset_user WHERE asset_id = ? AND user_id = ?";
            await db.execute(deleteQuery, [assetId, userId]);
            res.status(200).json({ message: "Unregistered successfully" });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getParticipants: async (req, res) => {
        try {
            const assetId = req.params.assetId;
            // Truy vấn bảng liên kết để lấy toàn bộ thông tin của cả asset_user
            const query = `
                SELECT asset_user.*, users.* 
                FROM asset_user 
                JOIN users ON users.id = asset_user.user_id 
                WHERE asset_user.asset_id = ?
            `;
            const [participants] = await db.execute(query, [assetId]);
            res.status(200).json({ participants });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getUserAssets: async (req, res) => {
        try {
            const userId = req.params.userId;
            // Truy vấn để lấy thông tin từ bảng assets và bảng asset_user
            const query = `
                SELECT assets.*, asset_user.*
                FROM assets 
                JOIN asset_user ON assets.id = asset_user.asset_id 
                WHERE asset_user.user_id = ?
            `;
            const [userAssets] = await db.execute(query, [userId]);
            res.status(200).json({ userAssets });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    uploadSubmissionFile: async (req, res) => {
        try {
            const { assetId, userId, submissionFile } = req.body;

            // Kiểm tra xem người dùng đã đăng ký tham gia chưa
            const checkQuery =
                "SELECT * FROM asset_user WHERE asset_id = ? AND user_id = ?";
            const [existingRecord] = await db.execute(checkQuery, [
                assetId,
                userId,
            ]);
            if (existingRecord.length === 0) {
                return res
                    .status(400)
                    .json({
                        message: "User has not registered for this asset",
                    });
            }

            // Cập nhật đường dẫn submission_file trong bảng asset_user
            const updateQuery =
                "UPDATE asset_user SET submission_file = ? WHERE asset_id = ? AND user_id = ?";
            await db.execute(updateQuery, [submissionFile, assetId, userId]);

            res.status(200).json({
                message: "Submission file uploaded successfully",
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    submitSubmissionComment: async (req, res) => {
        try {
            const { assetId, userId, submissionComment } = req.body;

            // Kiểm tra xem người dùng đã đăng ký tham gia chưa
            const checkQuery =
                "SELECT * FROM asset_user WHERE asset_id = ? AND user_id = ?";
            const [existingRecord] = await db.execute(checkQuery, [
                assetId,
                userId,
            ]);
            if (existingRecord.length === 0) {
                return res
                    .status(400)
                    .json({
                        message: "User has not registered for this asset",
                    });
            }

            // Cập nhật submission_comment trong bảng asset_user
            const updateQuery =
                "UPDATE asset_user SET submission_comment = ? WHERE asset_id = ? AND user_id = ?";
            await db.execute(updateQuery, [submissionComment, assetId, userId]);

            res.status(200).json({
                message: "Submission comment added successfully",
            });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getAssetsByCategoryId: async (req, res) => {
        try {
            const categoryId = req.params.categoryId;
            const query = `
                SELECT assets.*, 
                       asset_categories.name AS category_name, 
                       users.username AS created_by_username 
                FROM assets 
                LEFT JOIN asset_categories ON assets.category_id = asset_categories.id
                LEFT JOIN users ON assets.createdBy = users.id
                WHERE assets.category_id = ?
            `;
            const [assets] = await db.execute(query, [categoryId]);
            res.status(200).json({ data: assets });
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

module.exports = assetController;
