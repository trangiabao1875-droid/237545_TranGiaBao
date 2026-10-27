const express = require('express');
const Employee = require('../models/Employee');

const router = express.Router();

const fields = [
    'employeeId',
    'fullName',
    'gender',
    'dateOfBirth',
    'department',
    'position',
    'email',
    'phone',
    'hireDate',
    'status'
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


function clean(body) {
    const data = {};

    for (const key of fields) {
        if (Object.prototype.hasOwnProperty.call(body, key)) {
            data[key] = typeof body[key] === 'string'
                ? body[key].trim()
                : body[key];
        }
    }

    return data;
}


function validate(data) {
    if (!data.employeeId || !data.fullName || !data.email) {
        return 'Mã nhân viên, họ tên và email là bắt buộc';
    }

    if (!emailPattern.test(data.email)) {
        return 'Email không hợp lệ';
    }

    return null;
}


function failure(res, err) {
    if (err.code === 11000) {
        return res.status(409).json({
            message: 'Mã nhân viên đã tồn tại'
        });
    }

    if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).json({
            message: err.message
        });
    }

    console.error(err);

    return res.status(500).json({
        message: 'Lỗi máy chủ'
    });
}


function escapeRegex(s) {
    return s.replace(/[^a-zA-Z0-9 ]/g, ch => '\\' + ch);
}


router.get('/', async (req, res) => {
    try {
        const q = String(req.query.search || '').trim();

        const filter = q
            ? {
                $or: [
                    {
                        employeeId: {
                            $regex: escapeRegex(q),
                            $options: 'i'
                        }
                    },
                    {
                        fullName: {
                            $regex: escapeRegex(q),
                            $options: 'i'
                        }
                    }
                ]
            }
            : {};

        const employees = await Employee.find(filter)
            .sort({ createdAt: -1 });

        res.json(employees);

    } catch (err) {
        failure(res, err);
    }
});


router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findOne({
            employeeId: req.params.id
        });

        if (!employee) {
            return res.status(404).json({
                message: 'Không tìm thấy nhân viên'
            });
        }

        res.json(employee);

    } catch (err) {
        failure(res, err);
    }
});


router.post('/', async (req, res) => {
    try {
        const data = clean(req.body);

        const error = validate(data);

        if (error) {
            return res.status(400).json({
                message: error
            });
        }

        const employee = await Employee.create(data);

        res.status(201).json({
            message: 'Đã thêm nhân viên',
            employee
        });

    } catch (err) {
        failure(res, err);
    }
});


router.put('/:id', async (req, res) => {
    try {

        const current = await Employee.findOne({
            employeeId: req.params.id
        });

        if (!current) {
            return res.status(404).json({
                message: 'Không tìm thấy nhân viên'
            });
        }

        const data = {
            ...current.toObject(),
            ...clean(req.body)
        };

        const error = validate(data);

        if (error) {
            return res.status(400).json({
                message: error
            });
        }

        const employee = await Employee.findOneAndUpdate(
            {
                employeeId: req.params.id
            },
            {
                $set: clean(req.body)
            },
            {
                new: true,
                runValidators: true
            }
        );

        res.json({
            message: 'Đã cập nhật nhân viên',
            employee
        });

    } catch (err) {
        failure(res, err);
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findOneAndDelete({
            employeeId: req.params.id
        });

        if (!employee) {
            return res.status(404).json({
                message: 'Không tìm thấy nhân viên'
            });
        }

        res.json({
            message: 'Đã xóa nhân viên'
        });

    } catch (err) {
        failure(res, err);
    }
});

module.exports = router;
