const db = require("../dbConnection/pgPool");

const getMenuDetails = (req, response) => {
    const createQuery = `SELECT category, array_agg(children) as children
    FROM (SELECT menu_category as category, json_build_object('name', menu_name, 'url', menu_url)::text as children
        FROM role_menu_master
        WHERE active_flag='Y' 
            AND role_type_id=(SELECT role_type_id FROM user_master WHERE user_code=$1)) _
    GROUP BY category`;
    const values = [req.body.user_code];
    db.pool.query(createQuery, values, (err, res) => {
        if (err) {
            db.pool.end;
            debugLog("Get Menu List: ", err);
            return response.status(500).send({
                Status: false,
                Message: "Internal Server Error.",
                Data: [],
            });
        } else if (res.rows.length === 0) {
            db.pool.end;
            return response
                .status(404)
                .send({ Status: false, Message: "No Data Found.", Data: [] });
        } else if (res.rows.length > 0) {
            db.pool.end;
            const result = res.rows;
            const ret = [];
            result.forEach(function (v) {
                let obj = { category: v.category };
                let arr = [];
                v.children.forEach((i) =>
                    arr.push(JSON.parse(i.replace("'", "")))
                );
                obj.children = arr;
                ret.push(obj);
            });
            return response.status(200).send({
                Status: true,
                Message: "Menu List Found For User.",
                Data: [ret],
            });
        }
    });
};

module.exports = {
    getMenuDetails,
};
