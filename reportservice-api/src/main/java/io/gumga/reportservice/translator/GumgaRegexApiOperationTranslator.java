package io.gumga.reportservice.translator;

import io.gumga.reportservice.configuration.security.OperationExpression;
import io.gumga.reportservice.configuration.security.SecurityIntegration;
import io.gumga.security.ApiOperationTranslator;
import io.gumga.security.GumgaOperationTO;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

/**
 * Created by willian on 16/11/17.
 */
@Component
public class GumgaRegexApiOperationTranslator implements ApiOperationTranslator {

    private final List<OperationExpression> operations = SecurityIntegration.operations;

    public String getOperation(String url, String method) {
        for (OperationExpression oe : operations) {
            if (url.matches(oe.url) && method.matches(oe.method)) {
                return oe.operation;
            }
        }
        return "NOOP";
    }

    public static int getResponseCode(String urlString) {
        try {
            URL u = new URL(urlString);
            HttpURLConnection huc = (HttpURLConnection) u.openConnection();
            huc.setRequestMethod("GET");
            huc.setConnectTimeout(2000);
            huc.setReadTimeout(2000);
            huc.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.1.2) Gecko/20090729 Firefox/3.5.2 (.NET CLR 3.5.30729)");
            huc.connect();
            return huc.getResponseCode();
        } catch (MalformedURLException ex) {
            return -1;
        } catch (IOException ex) {
            return -2;
        }
    }

}