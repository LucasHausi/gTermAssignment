module.exports = async function (context, req) {

    console.log("this is from Post test-------------------");
    console.log(req);
    console.log("-------------------");

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: "teest"
    };
}