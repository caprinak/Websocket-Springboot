/*
Freeware License, some rights reserved

Copyright (c) 2023 Iuliana Cosmina

Permission is hereby granted, free of charge, to anyone obtaining a copy 
of this software and associated documentation files (the "Software"), 
to work with the Software within the limits of freeware distribution and fair use. 
This includes the rights to use, copy, and modify the Software for personal use. 
Users are also allowed and encouraged to submit corrections and modifications 
to the Software for the benefit of other users.

It is not allowed to reuse,  modify, or redistribute the Software for 
commercial use in any way, or for a user's educational materials such as books 
or blog articles without prior permission from the copyright holder. 

The above copyright notice and this permission notice need to be included 
in all copies or substantial portions of the software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS OR APRESS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
package io.satori.boot;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Created by iuliana on 13/03/2023
 */
@Controller
public class IndexController {
    @GetMapping(path = {"/","index"})
    public String index(Model model, HttpServletRequest request) {
        var requestUrl= request.getRequestURL().toString();
        var webSocketAddress = requestUrl.contains("index") ?
                requestUrl.replace("http", "ws").replace("index", "echoHandler")
                : requestUrl.replace("http", "ws") + "echoHandler";
        model.addAttribute("webSocket", webSocketAddress);
        return "index";
    }

    @GetMapping(path = "index2")
    public String index2(Model model, HttpServletRequest request) {
        var requestUrl= request.getRequestURL().toString();
        var webSocketAddress = requestUrl.replace("index2", "sockjs/echoHandler");
        model.addAttribute("webSocket", webSocketAddress);
        return "index2";
    }

    @GetMapping(path = "index3")
    public String index3(Model model, HttpServletRequest request) {
        var requestUrl= request.getRequestURL().toString();
        var endpointAddress = requestUrl.replace("index3", "ws");
        model.addAttribute("endpoint", endpointAddress);
        return "index3";
    }
}
