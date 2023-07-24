# Run tests after code is complete

import re

class Tester:
    def __init__(self, code_to_check, console_output, json_file):
        self.code_to_check = code_to_check
        self.console_output = console_output
        self.type_mapper = {
            "regex": self.run_regex_test,
            "output": self.run_output_test,
            "function": self.run_function_test
        }
        self.output = []

        self.run_tests(json_file.tests)

    def run_tests(self, test_cases):
        testing_complete = False
        for test_case in test_cases:
            try:
                result = self.run_test_case(test_case)
            except Exception as error:
                self.handle_test_case_error(error)
                return
            else:
                if testing_complete:
                    continue
                self.add_result(test_case, result)
                if result == "fail":
                    testing_complete = True
    
    def run_test_case(self, test_case):
        test_type = test_case.type
        test_to_run = self.type_mapper[test_type]
        return test_to_run(test_case.info)

    def handle_test_case_error(self, error):
        self.output = [{"ErrorEncountered": str(error)}]
        
    def add_result(self, test_case, result):
        if result == "success":
            self.add_to_output(test_case.name, "success")
        else:
            self.add_to_output(test_case.name, "fail", test_case.feedback)
    
    def run_regex_test(self, data):
        pattern = data.string
        # test_string = r'{}'.format(self.code_to_check)
        test_string = self.code_to_check
        if re.search(pattern, test_string):
            return "success"
        else:
            return "fail"

    def run_output_test(self, data):
        pattern = data.output
        test_string = self.console_output
        if re.search(pattern, test_string):
            return "success"
        else:
            return "fail"

    def run_function_test(self, data):
        for case in data.cases:
            loc = {}
            args_str = self.get_stringified_args(case.args.to_py())
            function_call = data.function+"("+args_str+")"
            exec("return_value = "+function_call, globals(), loc)
            return_value = loc["return_value"]
            if return_value != case.expected_return_value:
                return "fail"
        return "success"
    
    def get_stringified_args(self, arr):
        return ', '.join(repr(item) for item in arr)

    def add_to_output(self, name, result, feedback=None):
        test_result = {
            "name": name,
            "result": result,
        }
        if feedback != None:
            test_result["feedback"] = feedback
        self.output.append(test_result)

    def get_result(self):
        return self.output

def test_student_code():
    tester = Tester(code_to_check, console_output, json_file)
    output = tester.get_result()
    return output
test_student_code()