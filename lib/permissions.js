/**
 * Created by shen on 15/9/15.
 */

ownsDocument = function (userId, item) {
    return item && item.submittedBy === userId;
}

