import { Field, Form, Formik, FormikProps } from "formik";
import { IDivisionRdpsEditInterface } from "../../../../../../../interfaces/AppInterfaces/DivisionRdpsInterface/DivisionRdpsEditInterface";
import { useContext } from "react";
import { DivisionRdpsContext } from "../../../../../../../contexts/AppLayout/Admin/DivisionRdpsContext/DivisionRdpsContext";
import { Button } from "@chakra-ui/react";
import { useGetDivisionRdpsUpdate } from "../../../../../../../api/queries/app/hooks/division_rdps_edit_api_hooks";

interface EditInterface {
  editId: string;
  onClose:() => void;
}

export const RdpsEditForm: React.FC<EditInterface> = ({ editId,onClose }) => {

  const { divisionRdpsData } = useContext(DivisionRdpsContext);

  const editData = divisionRdpsData.data.result.filter((x) => x.id.toLowerCase().includes(editId.toLowerCase()));
  const {mutate} = useGetDivisionRdpsUpdate();



  return (
    <Formik
      onSubmit={(values, action) => {
        onClose();
        mutate({
            id: values.id,
            kilometer: values.kilometer,
            distance: values.distance,
            latitude: values.latitude,
            longitude: values.longitude,
            section: values.section,
            geo_location: {
                type: values.geo_location.type,
                coordinates: [
                    values.longitude,
                    values.latitude
                ]
            },
            feature_code: values.feature_code,
            division_id: values.division_id,
            active_status: values.active_status,
            feature_image: values.feature_image,
            feature_detail: values.feature_detail
        })
        setTimeout(() => {
          action.setSubmitting(false);
        
        }, 900);
      }}
      initialValues={{
        id: editData[0].id,
        kilometer: editData[0].kilometer,
        distance: editData[0].distance,
        latitude: editData[0].latitude,
        longitude: editData[0].longitude,
        section: `${editData[0].section}`,
        geo_location: {
          type: `${editData[0].geo_location.type}`,
          coordinates: [
            editData[0].geo_location.coordinates[0],
            editData[0].geo_location.coordinates[1],
          ],
        },
        feature_code: editData[0].feature_code,
        division_id: editData[0].division_id,
        active_status: editData[0].active_status,
        feature_image: editData[0].feature_image,
        feature_detail: editData[0].feature_detail,
      }}
    >
      {({ values }: FormikProps<IDivisionRdpsEditInterface>) => (
        <Form>
          <div>
            <div className="flex justify-between items-center border-b-2 border-black">
                <div>
                <label htmlFor="" className="font-semibold">Feature Image</label>
              <img
                src={
                  "https://primesystrack.in" +
                  values.feature_image.replace("~/Images", "/")
                }
                className="w-14 h-14"
                alt=""
              />
                </div>
            </div>
            <div className="gap-2 w-full">
              <div>
                <label htmlFor="section" className="font-semibold">
                  Section Name
                </label>
                <Field
                  type="string"
                  name="section"
                  id="section"
                  className="w-full py-2 px-1 border-2 border-gray-500 focus:border-black"
                />
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <div className="w-full">
                <label htmlFor="kilometer" className="font-semibold">
                  Kilometer
                </label>
                <Field
                  type="number"
                  name="kilometer"
                  id="kilometer"
                  className="w-full py-2 px-1 border-2 border-gray-500 focus:border-black"
                />
              </div>
              <div className="w-full">
                <label htmlFor="distance" className="font-semibold">
                  Distance
                </label>
                <Field
                  type="number"
                  name="distance"
                  id="distance"
                  className="w-full py-2 px-1 border-2 border-gray-500 focus:border-black"
                />
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <div className="w-full">
                <label htmlFor="latitude" className="font-semibold">
                  Latitude
                </label>
                <Field
                  type="number"
                  name="latitude"
                  id="latitude"
                  className="w-full py-2 px-1 border-2 border-gray-500 focus:border-black"
                />
              </div>
              <div className="w-full">
                <label htmlFor="longitude" className="font-semibold">
                  Longitude
                </label>
                <Field
                  type="number"
                  name="longitude"
                  id="longitude"
                  className="w-full py-2 px-1 border-2 border-gray-500 focus:border-black"
                />
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <div className="w-full">
                <label htmlFor="feature_code" className="font-semibold">
                  Feature Code
                </label>
                <Field
                  type="string"
                  name="feature_code"
                  id="feature_code"
                  className="w-full py-2 px-1 border-2 border-gray-500 focus:border-black"
                />
              </div>
              <div className="w-full">
                <label htmlFor="feature_detail" className="font-semibold">
                  Feature Detail
                </label>
                <Field
                  type="string"
                  name="feature_detail"
                  id="feature_detail"
                  className="w-full py-2 px-1 border-2 border-gray-500 focus:border-black"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button type="button" colorScheme="red">
                Cancel
              </Button>
              <Button type="submit" colorScheme="green">
                Submit
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
