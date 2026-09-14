package com.urlshortene.tinyroute.util;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class UrlUtil {

    private static final char[] BASE62 =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
                    .toCharArray();

    private static final int LENGTH = 7;
    // 62^7 possible combinations
    private static long maxValue = 3_521_614_606_208L;

    public static String encodeBase62(long id) {

        if (id < 0) {
            throw new IllegalArgumentException("ID cannot be negative");
        }

        if (id >= maxValue) {
            throw new IllegalArgumentException(
                    "ID is too large for a 7-character Base62 code"
            );
        }

        char[] result = new char[LENGTH];

        // Fill with Base62 zero character
        java.util.Arrays.fill(result, BASE62[0]);

        int index = LENGTH - 1;

        while (id > 0) {
            result[index--] = BASE62[(int) (id % 62)];
            id /= 62;
        }

        log.info(id + " url is created");

        return new String(result);
    }
}
