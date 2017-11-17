package io.gumga.reportservice.configuration.security;

import java.util.List;
import java.util.Map;

/**
 * Created by willian on 16/11/17.
 */
public class OperationExpression {

    public String url, method, operation;

    public OperationExpression(String operation, String url, String method) {
        this.url = url;
        this.method = method;
        this.operation = operation;
    }
}
